# 实现一个简单的commonjs异步加载

隔离异步文件

## 异步import 返回了什么

返回了一个promise

## promise干什么了

通过script标签把文件加载到html中，文件加载执行完成之后，
文件执行的时候会把自己注册到模块对象中，
然后在import的地方可以用then方法获取到模块对象中文件导出的内容，然后可以执行里面的方法。

## lazy干了什么

`const comp = lazy(()=>import('./t.js'))`
lazy的参数执行之后返回了一个promise，
lazy返回一个异步组件

## 自己实现一个lazy api

```jsx
import { Suspense, lazy, useEffect, useState } from 'react'

const MarkdownPreview = myLazy(() =>
  import('./MarkdownPreview.tsx'),
)

export function App() {
  const [showPreview, setShowPreview] = useState(false)
  const [markdown, setMarkdown] = useState('Hello, **world**!')

  return (
    <>
      <textarea
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={showPreview}
          onChange={e => setShowPreview(e.target.checked)}
        />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </>
      )}
    </>
  )
}

function myLazy(load) {
  function Comp(props) {
    const [Content, setContent] = useState(null)
    useEffect(() => {
      load().then((a) => {
        console.log(a.default)
        setContent({ A: a.default })
      })
    }, [])
    console.log(props, Content)
    return Content ? <Content.A {...props} /> : <div>loading...</div>
  }
  return Comp
}

function delayForDemo(promise: Function) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  }).then(() => promise)
}

```

MarkdownPreview.tsx

```
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview(props) {
  console.log(':::', props);
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{ __html: md.render(props.markdown) }}
    />
  );
}

```
