import 'minireset.css/minireset.css'
import 'tippy.js/dist/tippy.css' // optional
import 'tippy.js/themes/light.css'
import {MDXProvider} from '@mdx-js/react'
import {theme, ThemeProvider} from '@primer/components'
import React from 'react'
import components from './mdx-components'

function wrapRootElement({element}) {
  return (
    <ThemeProvider theme={theme} colorMode="auto">
      <MDXProvider components={components}>{element}</MDXProvider>
    </ThemeProvider>
  )
}

export default wrapRootElement
