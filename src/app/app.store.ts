import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

const COOLDOWN = 60;
const GAME_LENGHT = 300;

const MOCK_GAME = `Lorem ipsum dolor sit amet.`;

export enum GAME_STATE {
    PROGRESS = 'progress',
    FINISH = 'finish',
    ERROR = 'error'
}

@Injectable()
export class AppStore {

    public static STATE: EventEmitter<GAME_STATE> = new EventEmitter<GAME_STATE>();

    public static gameEntry: BehaviorSubject<string> = new BehaviorSubject<string>(MOCK_GAME);
    public static userEntry: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public static userProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private static is_game: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private static timer_game: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private static users_progress: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    public static isGameObservable: Observable<boolean> = AppStore.is_game.asObservable();
    public static timerGameObservable: Observable<number> = AppStore.timer_game.asObservable();
    public static usersProgress: Observable<any[]> = AppStore.users_progress.asObservable();

    constructor(private socket: Socket) {
        setInterval(() => {
            const game_time = AppStore.timer_game.getValue();
            const is_game = AppStore.is_game.getValue();
            if (game_time > 0) {
                AppStore.timer_game.next(game_time - 1);
            } else {
                if (is_game) {
                    AppStore.timer_game.next(GAME_LENGHT);
                    AppStore.is_game.next(false);
                } else {
                    AppStore.timer_game.next(COOLDOWN);
                    AppStore.is_game.next(true);
                }
            }
        }, 1000);
    }

}

