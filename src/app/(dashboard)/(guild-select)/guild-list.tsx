'use client';

import { Discord } from '@/lib/constants';
import { Icon } from '@iconify-icon/react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function GuildList({
  guilds,
}: { guilds: RESTAPIPartialCurrentUserGuild[] }) {
  const [filterValue, setFilterValue] = useState('');
  const filteredGuilds = guilds.filter(
    (guild) =>
      guild.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      guild.id === filterValue,
  );

  return (
    <div className='py-6 flex flex-col gap-6'>
      <div className='flex flex-col sm:items-stretch sm:flex-row gap-3'>
        <Input
          size='md'
          startContent={
            <Icon icon='solar:magnifer-outline' className='text-[20px]' />
          }
          onValueChange={(e) => setFilterValue(e.toLowerCase())}
          placeholder='名前またはサーバーIDで検索'
        />
        <Link
          href={`${
            Discord.Endpoints.API
          }/oauth2/authorize?${new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_DISCORD_ID,
            scope: 'bot',
            permissions: `${process.env.NEXT_PUBLIC_DISCORD_PERMISSION}`,
            response_type: 'code',
            redirect_uri: `${process.env.NEXT_PUBLIC_BASEURL}/dashboard`,
          }).toString()}`}
          passHref
        >
          <Button
            className='rounded-lg w-full sm:w-auto'
            startContent={
              <Icon icon='solar:add-circle-bold' className='text-[20px]' />
            }
            color='primary'
          >
            サーバーに導入
          </Button>
        </Link>
      </div>
      {!filteredGuilds.length ? (
        <Card className='flex h-[350px] items-center justify-center'>
          <div className='flex flex-col items-center gap-3'>
            <Icon
              icon='solar:magnifer-outline'
              className='text-muted-foreground text-[64px]'
            />
            <p className='text-center '>
              <span className='inline-block'>条件に一致するサーバーが</span>
              <span className='inline-block'>見つかりませんでした</span>
            </p>
          </div>
        </Card>
      ) : (
        <div className='grid grid-cols-10 gap-6'>
          {filteredGuilds.map((guild) => (
            <GridItem key={guild.id} guild={guild} />
          ))}
        </div>
      )}
    </div>
  );
}

export function GridItem({ guild }: { guild: RESTAPIPartialCurrentUserGuild }) {
  return (
    <Link
      className='col-span-10 sm:col-span-5 lg:col-span-2'
      key={guild.id}
      href={`/guilds/${guild.id}`}
      passHref
    >
      <Card className='overflow-hidden h-full' fullWidth isPressable>
        <CardBody className='items-center justify-center bg-content2 h-28'>
          <Image
            className='pointer-events-none rounded-full'
            src={
              guild.icon
                ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.webp`
                : `${Discord.Endpoints.CDN}/embed/avatars/0.png`
            }
            width={70}
            height={70}
            alt={`${guild.name}のサーバーアイコン`}
          />
        </CardBody>
        <CardFooter className='justify-center p-3'>
          <p>{guild.name}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
