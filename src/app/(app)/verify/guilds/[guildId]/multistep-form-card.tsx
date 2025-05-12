'use client';

import { Logo } from '@/components/logo';
import { Card } from '@heroui/react';
import type { APIGuild } from 'discord-api-types/v10';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { CaptchaForm } from './captcha-form';
import { VerifyForm } from './verify-form';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? -30 : 30,
    opacity: 0,
  }),
};

export default function MultiStepVerificationCard({ guild }: { guild: APIGuild }) {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setPage((prev) => {
      const nextPage = prev[0] + newDirection;
      if (nextPage < 0 || nextPage > 3) return prev;
      return [nextPage, newDirection];
    });
  }, []);

  const onNext = useCallback(() => {
    paginate(1);
  }, [paginate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const content = useMemo(() => {
    let component = <VerifyForm guild={guild} onNext={onNext} />;

    switch (page) {
      case 1:
        component = <CaptchaForm onNext={onNext} />;
        break;
      case 2:
        component = <div>Success</div>;
        break;
    }

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={page}
          animate='center'
          className='col-span-12'
          custom={direction}
          exit='exit'
          initial='exit'
          transition={{
            y: {
              ease: 'backOut',
              duration: 0.35,
            },
            opacity: { duration: 0.4 },
          }}
          variants={variants}
        >
          {component}
        </m.div>
      </LazyMotion>
    );
  }, [direction, page]);

  return (
    <div className='max-w-[400px] w-full flex flex-col gap-3'>
      <Card className='w-full flex flex-col gap-6 px-6 py-8'>
        <Logo width={110} />
        {content}
      </Card>
    </div>
  );
}
