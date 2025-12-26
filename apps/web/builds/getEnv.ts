import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

export function isDev(mode: string): boolean {
  return mode === 'development'
}

export function isProd(mode: string): boolean {
  return mode === 'production'
}

export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT')
      realName = Number(realName)
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName)
      }
      catch (error) {
        console.log(error)
      }
    }
    ret[envName] = realName
  }
  return ret
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir)
}

export function loadEnv(mode: string, envDir: string) {
  const envPath = `${envDir}/.env`
  const localEnvPath = `${envDir}/.env.${mode}`

  const _loadEnv = (envPath) => {
    const env = dotenv.config({ path: envPath })
    if (env.error) {
      throw new Error(`Failed to load env from ${envPath}: ${env.error}`)
    }
    return env.parsed
  }

  const env = [localEnvPath, envPath]
    .filter(path => fs.existsSync(path))
    .map(path => _loadEnv(path))

  // 将加载的环境变量合并，并添加到Vite配置中
  return env.reduce((acc, envs) => ({ ...acc, ...envs }), {})
}
