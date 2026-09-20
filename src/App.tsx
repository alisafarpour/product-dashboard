import { RouterProvider } from 'react-router-dom';
import {Providers} from "./app/providers.tsx";
import {router} from "./app/router.tsx";

export default function App() {
  return (
      <Providers>
        <RouterProvider router={router} />
      </Providers>
  );
}
