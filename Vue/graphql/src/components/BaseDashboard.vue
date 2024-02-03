<template>
    <div>
        <main>
            <!-- Dashboard main content -->
            <slot></slot> <!-- Content from child components will be inserted here -->
        </main>
        <footer>
            <!-- Dashboard footer content -->
        </footer>
    </div>
</template>
  
<script>

export default {
    name: 'Dashboard',
};
</script>