import { pathToFileURL } from 'node:url'

const ROOT_URL = pathToFileURL(process.cwd() + '/').href

export async function resolve(specifier, context, nextResolve) {
  let spec = specifier
  let ctx = context

  if (spec.startsWith('@/')) {
    spec = './src/' + spec.slice(2)
    ctx = { ...ctx, parentURL: ROOT_URL }
  }

  try {
    return await nextResolve(spec, ctx)
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' && !/\.\w+$/.test(spec)) {
      return nextResolve(spec + '.ts', ctx)
    }
    throw err
  }
}
