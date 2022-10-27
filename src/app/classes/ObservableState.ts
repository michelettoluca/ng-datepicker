import { BehaviorSubject, Observable } from "rxjs";

export class ObservableState<T> {
  private subject: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.subject = new BehaviorSubject(initialState);
  }

  public get current(): T {
    return this.subject.value;
  }

  public set current(value: T) {
    this.subject.next(value);
  }

  public get $(): Observable<T> {
    return this.subject.asObservable();
  }
}
