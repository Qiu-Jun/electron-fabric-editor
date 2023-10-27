/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 20:51:14
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 21:30:15
 */
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface PaletteOption {
  name: string
  description?: string
  icon?: Component
  action?: () => void
  to?: RouteLocationRaw
  category: string
  keywords?: string[]
  href?: string
  closeOnSelect?: boolean
}
