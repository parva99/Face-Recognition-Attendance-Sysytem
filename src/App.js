import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SiteContainer } from './styles/main/MainStyles';
import UserProvider from './context/UserContext';
import NotificationProvider from './context/NotificationContext';

const Navbar = lazy(() => import('./components/nav/Navbar'));
const Notifications = lazy(() => import('./components/notifications/Notifications'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Home = lazy(() => import('./components/landing/Home'));
const Home2 = lazy(() => import('./components/landing/Home2'));
const Attendance = lazy(() => import('./components/functions/Attendance'));
const Capture = lazy(() => import('./components/functions/Capture'));
const Addnew = lazy(() => import('./components/functions/Addnew'));
const Students = lazy(() => import('./components/functions/Students'));
const About = lazy(() => import('./components/landing/About'));

function App() {
  return (
    <SiteContainer>
      <UserProvider>
        <NotificationProvider>

          <Suspense fallback={<div></div>}>
            <Navbar />
          </Suspense>

          <Suspense fallback={<div></div>}>
            <Notifications />
          </Suspense>

          <BrowserRouter>
            <Switch>

              <Route path="/register">
                <Suspense fallback={<div>Loading...</div>}>
                  <Register />
                </Suspense>
              </Route>

              <Route path="/login">
                <Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </Suspense>
              </Route>

              <Route path="/home">
                <Suspense fallback={<div>Loading...</div>}>
                  <Home2 />
                </Suspense>
              </Route>

              <Route path="/capture">
                <Suspense fallback={<div>Loading...</div>}>
                  <Capture />
                </Suspense>
              </Route>

              <Route path="/attendance">
                <Suspense fallback={<div>Loading...</div>}>
                  <Attendance />
                </Suspense>
              </Route>

              <Route path="/add_new">
                <Suspense fallback={<div>Loading...</div>}>
                  <Addnew />
                </Suspense>
              </Route>

              <Route path="/students">
                <Suspense fallback={<div>Loading...</div>}>
                  <Students />
                </Suspense>
              </Route>

              <Route path="/about">
                <Suspense fallback={<div>Loading...</div>}>
                  <About />
                </Suspense>
              </Route>

              <Route path="/" exact>
                <Suspense fallback={<div>Loading...</div>}>
                  <Home />
                </Suspense>
              </Route>

              <Route path="" exact>
                <h1>404 URL Not Found</h1>
              </Route>
              
            </Switch>
          </BrowserRouter>
        </NotificationProvider>
      </UserProvider>
    </SiteContainer>
  );
}

export default App;
