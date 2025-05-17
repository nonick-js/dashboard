'use client';
import { Alert } from '@heroui/react';
import type { APIRole } from 'discord-api-types/v10';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { z } from 'zod';
import { SettingForm } from './form';
import type { verificationSettingFormSchema } from './schema';

type Props = {
  setting: z.output<typeof verificationSettingFormSchema> | null;
  roles: APIRole[];
};

export function AnimatedPage({ setting, roles }: Props) {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (setting?.enabled) {
      setShowSuccessAlert(true);
    } else {
      setShowSuccessAlert(false);
    }
  }, [setting?.enabled]);

  return (
    <>
      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div
            key='success-alert'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              color='success'
              variant='faded'
              title='メンバー認証の準備が整いました！'
              description='チャンネル内で「/create verify-panel」を実行して、認証パネルを送信しましょう。'
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div layout>
        <SettingForm roles={roles} setting={setting} />
      </motion.div>
    </>
  );
}
