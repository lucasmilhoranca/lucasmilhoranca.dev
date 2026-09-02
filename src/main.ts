const root = document.documentElement
const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle')

function setTheme(dark: boolean) {
  root.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  toggle?.setAttribute('aria-pressed', String(dark))
}

toggle?.setAttribute('aria-pressed', String(root.classList.contains('dark')))

toggle?.addEventListener('click', () => {
  setTheme(!root.classList.contains('dark'))
})

const yearEl = document.querySelector('#year')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')
const menuIconOpen = document.querySelector<HTMLElement>('#menu-icon-open')
const menuIconClose = document.querySelector<HTMLElement>('#menu-icon-close')

function setMenu(open: boolean) {
  mobileMenu?.classList.toggle('hidden', !open)
  menuIconOpen?.classList.toggle('hidden', open)
  menuIconClose?.classList.toggle('hidden', !open)
  menuToggle?.setAttribute('aria-expanded', String(open))
}

menuToggle?.addEventListener('click', () => {
  setMenu(mobileMenu?.classList.contains('hidden') ?? false)
})

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})
