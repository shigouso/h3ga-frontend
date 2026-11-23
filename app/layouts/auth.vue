<template>
  <div class="flex min-h-dvh bg-neutral-50">
    <!-- Panel decorativo: semicírculo verde con la ilustración (solo en pantallas anchas). -->
    <aside
      class="sticky top-0 hidden h-dvh w-[55%] min-w-[446px] max-w-[948px] shrink-0 items-center overflow-hidden rounded-r-[560px] bg-profundo-500 lg:flex"
      aria-hidden="true"
    >
      <div
        class="flex h-full w-full items-center justify-start py-8 pl-[4%] pr-[12%]"
      >
        <img
          src="/img/login-hero.png"
          alt=""
          class="max-h-[calc(100dvh-4rem)] w-full max-w-[640px] object-contain"
        >
      </div>
    </aside>

    <main
      class="flex min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-12"
    >
      <slot />
    </main>
  </div>
</template>
