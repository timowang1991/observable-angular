import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private firstObsSubscription: Subscription;
  private customObsSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.firstObsSubscription = interval(1000).subscribe((count) => console.log(count));
    
    const customIntervalObservable = Observable.create(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        count += 1
        if (count === 2) {
          observer.complete(); // completes the observable and does not continue
        }
        if (count > 3) {
          observer.error(new Error('Count is greater than 3')); // cancels the observable and does not continue
        }
      }, 1000);
    });

    this.customObsSubscription = customIntervalObservable.subscribe((data) => {
      console.log('data', data);
    }, (error) => {
      alert(error);
    }, () => {
      console.log('Completed!');
    });

    customIntervalObservable
      .pipe(
        filter((data: number) => {
          return data > 0;
        }),
        map((data: number) => {
          return 'Round ' + (data + 1);
        })
      ).subscribe((data) => {
        console.log('data 2', data)
      });
  }

  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe();
    this.customObsSubscription.unsubscribe();
  }

}
