import { useState, useEffect } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Global, css } from '@emotion/react';
import { Subscription } from 'rxjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../components/layout/header/header.component';
import Sidebar from '../components/layout/sidebar.component';
import Body from '../components/layout/body/body.component';
import Layout from '../components/layout/layout.component';
import WorkspaceContainer from './workspace.container';
import SidebarContainer from './sidebar.container';
import HeaderContainer from './header.container';
import theme from '../styles/theme.style';
import { globalStyles } from '../styles/global.style';
import SubscriptionService from '../services/subscription.service';
import { Task, TaskEventEnum } from '../types';
import config from '../utils/config.util';

const queryClient = new QueryClient();
const subscriptionInstance = new SubscriptionService();

const App: React.FC<{}> = () => {
  const [sidebarOpen] = useState(true);

  useEffect(() => {
    let subscription: Subscription;

    const onEventReceive = ({ type, payload }: {
      type: TaskEventEnum;
      payload: Task;
    }) => {
      switch (type) {
        case TaskEventEnum.TASK_ADDED: 
          queryClient.setQueryData<Task[]>(['workspaces', payload.workspaceId, 'tasks'], (existingTasks) => {
            // Ensure oldTasks is not undefined
            return existingTasks ? [...existingTasks, payload] : [payload];
          });
          break;

        case TaskEventEnum.TASK_UPDATED:
          queryClient.setQueryData<Task[]>(['workspaces', payload.workspaceId, 'tasks'], (existingTasks) => {
            return existingTasks ? existingTasks.map((t) => t.id === payload.id ? { ...t, ...payload } : t) : [payload];
          });
          break;

        default:
          // no action
      }
    };

    const onSubscriptionError = (error: Error) => {
      console.error('Subscription error:', error.message);
    };

    if (subscriptionInstance) {
      subscription = subscriptionInstance
        .start({
          uri: config.subscriptionUrl || 'ws://localhost:80',
          channel: 'default',
        })
        .subscribe({
          next: onEventReceive,
          error: onSubscriptionError,
        });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <Global styles={css`${globalStyles}`}/>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Header>
              <HeaderContainer />
            </Header>
            <Sidebar isOpen={sidebarOpen}>
              <SidebarContainer />
            </Sidebar>
            <Body>
              <WorkspaceContainer />
            </Body>
          </Layout>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  )
}


export default App
