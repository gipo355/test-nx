import type { Meta, StoryObj } from '@storybook/svelte';

import Card from '$lib/components/Card.svelte';

const meta = {
    title: 'Example/Card',
    component: Card,
    tags: ['autodocs'],
} satisfies Meta<Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
