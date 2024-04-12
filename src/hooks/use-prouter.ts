import * as NProgress from "nprogress";
import { useRouter } from "next/navigation";

export const usePRouter = () => {
  const router = useRouter();

  const { push } = router;

  router.push = (href, options) => {
    NProgress.start();
    push(href, options);
  };

  return router;
};