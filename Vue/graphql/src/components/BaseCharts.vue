<template>
    <div>
      <header>
        <!-- Profile header content -->
      </header>
      <main>
        <!-- Profile main content -->
        <slot></slot> <!-- Content from child components will be inserted here -->
      </main>
      <footer>
        <!-- Profile footer content -->
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Charts',
  };
  </script>