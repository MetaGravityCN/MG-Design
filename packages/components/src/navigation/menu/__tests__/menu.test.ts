import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { MgMenu } from '../index'
import { MgMenuItem } from '../../menu-item'
import { MgSubMenu } from '../../sub-menu'

describe('MgMenu', () => {
  it('selects items and toggles submenus', async () => {
    const wrapper = mount({
      components: { MgMenu, MgMenuItem, MgSubMenu },
      template: `<MgMenu default-active="home"><MgMenuItem index="home">首页</MgMenuItem><MgSubMenu index="system"><template #title>系统</template><MgMenuItem index="users">用户</MgMenuItem></MgSubMenu></MgMenu>`,
    })
    const menu = wrapper.findComponent(MgMenu)
    expect(wrapper.find('.mg-menu-item').classes()).toContain('is-active')
    await wrapper.find('.mg-sub-menu__title').trigger('click')
    expect(wrapper.find('.mg-sub-menu').classes()).toContain('is-opened')
    expect(menu.emitted('open')).toEqual([['system', ['system']]])
    await wrapper.findAll('.mg-menu-item')[1].trigger('click')
    expect(wrapper.findAll('.mg-menu-item')[1].classes()).toContain('is-active')
    expect(menu.emitted('select')).toEqual([['users', ['users']]])
  })
})
