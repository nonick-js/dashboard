﻿"use client";

import { Switch, type SwitchProps } from "@heroui/switch";
import { cn } from "@heroui/theme";
import type { HTMLAttributes, ReactNode } from "react";
import {
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	useController,
} from "react-hook-form";

type ControlledSwitchProps = {
	title?: ReactNode;
	description?: ReactNode;
	wrapperClass?: string;
} & SwitchProps;

export function ControlledSwitch<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	name,
	control,
	title,
	description,
	wrapperClass,
	...props
}: ControlledSwitchProps & UseControllerProps<TFieldValues, TName>) {
	const { field } = useController({ name, control });

	return (
		<div
			className={cn(
				"flex justify-between flex-row-reverse gap-3",
				wrapperClass,
			)}
		>
			<Switch
				ref={field.ref}
				onChange={field.onChange}
				onBlur={field.onBlur}
				isSelected={field.value}
				{...props}
			/>
			<div className="flex flex-col max-sm:gap-1">
				<SwitchTitle>{title}</SwitchTitle>
				{description && <SwitchDescription>{description}</SwitchDescription>}
			</div>
		</div>
	);
}

function SwitchTitle({
	className,
	...props
}: HTMLAttributes<HTMLLabelElement>) {
	// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
	return <label className={cn("text-sm", className)} {...props} />;
}

function SwitchDescription({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn("text-sm max-sm:text-xs text-default-500", className)}
			{...props}
		/>
	);
}
