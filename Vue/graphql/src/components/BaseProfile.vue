<template>
    <div>
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
    name: 'Profile',
  };
  </script>