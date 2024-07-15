export async function sleep(ms) {
  return new Promise((resolve: any) => {
    let timer: NodeJS.Timeout | null = setTimeout(() => {
      resolve()
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }, ms)
  })
}
