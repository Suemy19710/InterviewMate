import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import ResumeMatcherPage from '../pages/ResumeMatcher'
import SingleMatchPage from '../pages/SingleMatch'
// import NotFoundPage from '@pages/NotFound/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ResumeMatcherPage />
      },
      {
        path: 'single-match',
        element: <SingleMatchPage />
      },
    ]
  },
//   {
//     path: '*',
//     element: <NotFoundPage />
//   }
])