'use client';

import { Icon } from '@/components/icon';
import { Button, addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { useParams } from 'next/navigation';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { verifyAction } from './action';
import { captchaFormSchema } from './form-schema';

type InputSchema = z.input<typeof captchaFormSchema>;
type OutputSchema = z.input<typeof captchaFormSchema>;

export function CaptchaForm({ onNext }: { onNext: () => void }) {
  const { guildId } = useParams<{ guildId: string }>();

  const form = useForm<InputSchema, unknown, OutputSchema>({
    resolver: zodResolver(captchaFormSchema),
  });

  const onSubmit: SubmitHandler<OutputSchema> = async (values) => {
    const res = await verifyAction({ guildId, ...values });

    if (res?.data?.error) {
      return addToast({
        title: '認証中に問題が発生しました',
        description: '時間を置いてもう一度送信してください。',
        color: 'danger',
      });
    }
    onNext();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3'>
          <div>
            <p className='text-xl pb-1 font-extrabold'>メンバー認証</p>
            <p className='text-sm text-default-500'>Discordアカウントで認証を行います。</p>
          </div>
          <div className='py-6'>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => form.setValue('turnstileToken', token)}
              options={{ size: 'flexible' }}
            />
          </div>
          <div className='flex flex-col gap-3 w-full'>
            <Button
              type='submit'
              color='primary'
              startContent={
                !form.formState.isSubmitting && (
                  <Icon icon='solar:arrow-right-outline' className='text-2xl' />
                )
              }
              isLoading={form.formState.isSubmitting}
              isDisabled={!form.watch().turnstileToken}
            >
              続行
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
