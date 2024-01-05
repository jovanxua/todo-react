import { Socket, io } from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { Task, TaskEventEnum } from '../types';

export default class SubscriptionService {
  private subscriber: Subscriber<{
    type: TaskEventEnum;
    payload?: Task;
  }> | null = null;
  private socket!: Socket;

  private sendToSubscriber = (type: TaskEventEnum, payload?: Task) => {
    if (this.subscriber) {
      this.subscriber.next({ type, payload });
    } else {
      console.log('Failed to send to subscriber. subscription uninitialized');
    }
  };

  public start = ({ uri, channel }: { uri: string; channel: string }) => {
    const connect = () => {
      this.socket = io(uri, {
        reconnectionDelayMax: 5000,
      });

      this.socket.on('connect', () => {
        this.sendToSubscriber(TaskEventEnum.SERVER_CONNECTED, undefined);
        this.connectChannel(channel);
      });

      this.socket.on('connect_error', () => {
        this.sendToSubscriber(TaskEventEnum.SERVER_DISCONNECTED, undefined);
      });
  
      this.socket.on(TaskEventEnum.TASK_ADDED, (payload: Task) =>
        this.sendToSubscriber(TaskEventEnum.TASK_ADDED, payload)
      );
      this.socket.on(TaskEventEnum.TASK_UPDATED, (payload: Task) =>
        this.sendToSubscriber(TaskEventEnum.TASK_UPDATED, payload)
      );
      this.socket.on(TaskEventEnum.TASK_REMOVED, (payload: Task) =>
        this.sendToSubscriber(TaskEventEnum.TASK_REMOVED, payload)
      );

      this.socket.connect();
    };

    connect();

    return new Observable<{ type: TaskEventEnum; payload: Task }>(
      (subscriber) => {
        this.subscriber = subscriber;
      }
    );
  };

  public connectChannel = (channelId: string) => {
    this.socket.emit('join_channel', channelId);
  };
}
