<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 09:12:24
 * @LastEditors: June
 * @LastEditTime: 2024-07-24 20:30:09
 * @Description: logo
-->

<template>
  <div class="logo inline-block mr-10px">
    <a
      class="flex h-full align-center"
      href="https://github.com/ikuaitu/element-fabric-editor"
      target="_blank"
    >
      <img
        class="inline-block"
        src="@/assets/logo.png"
        alt="element-fabric-editor"
      />
    </a>
  </div>
</template>

<script setup name="Logo"></script>

<style scoped lang="scss">
.logo {
  width: 117px;
  height: 44px;
  a {
    img {
      height: 80%;
    }
  }
}
</style>
