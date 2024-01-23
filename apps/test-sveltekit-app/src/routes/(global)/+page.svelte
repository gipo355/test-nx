<script lang="ts">
  import type { Writable } from 'svelte/store';

  // import { hello } from '$lib/hello';
  // import { stringifyExample } from '$lib/types/fastJson';
  // import { createContext } from '$lib/utils/context';
  import { hello } from '$lib/hello';
  import { createContext } from '$lib/utils/context';

  console.log(hello.name);

  // console.log(
  //   stringifyExample({
  //     firstName: 'Matteo',
  //     lastName: 'Collina',
  //     age: 32,
  //     reg: /"([^"]|\\")*"/,
  //   })
  // );
  // import { locale, locales, t } from '$lib/translations';

  const context = createContext<Writable<string>>(Symbol('context'));
  const store = context.get();
  $: console.log($store);

  // const name = 'mark';
  // const surname = 'smith';

  // // const link = 'https://kit.svelte.dev';
  // const handleChange = (event: Event) => {
  //   const { currentTarget } = event;
  //   if (!(currentTarget instanceof HTMLSelectElement)) return;
  //   const { value } = currentTarget;

  //   document.cookie = `lang=${value} ;`;
  // };

  // $: fullname = `${name} ${surname}`;
</script>

hello

<!-- <h1>{$t('home.title')}</h1> -->
<!-- <!-- <p>{@html $t('home.text', { link })}</p> -->

<!-- <h1 class="text-slate-200">Hello {fullname}</h1> -->
<!-- <a href="/dashboard">dashboard</a> -->

<!-- <select bind:value={$locale} on:change={handleChange}> -->
<!--   {#each $locales as value} -->
<!--     <option {value} selected={$locale === value}>{$t(`lang.${value}`)}</option> -->
<!--   {/each} -->
<!-- </select> -->

<style lang="scss">
</style>
