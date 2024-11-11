<div>
  
<h2>  📄 컨벤션 및 브랜치 전략 </h2>

<br/>

## :cactus: 브랜치 전략

**브랜치 전략 1**

- main: 우리가 개발 최종시에 Merge를 하는 곳
- feat/{기능명}: 기능을 개발하면서 각자가 사용할 브랜치 ex) feat/Login
- 우리가 정의하는 기능명 → 구현 중인 페이지 (ex. Home, MyPage or Common)

```// 브랜치 생성 ❗❗항상 메인에 체크아웃해서 만들것❗❗
$ git branch feat/{기능명}
// 브랜치 체크아웃
$ git checkout feat/{기능명}
```

반드시 push는 feat/{기능명}/#{이슈번호}에 해주시고, github에서, develop에 PR 날리기!

### 📚 커밋 컨밴션

- 커밋 단위는 반드시 최소한의 작업 단위로 쪼개서, 한 PR당 10커밋 이상 넘어가지 않도록 합니다.

| 커밋     | 역할                                                                  |
| -------- | --------------------------------------------------------------------- |
| Feat     | 기능 구현과 관련된 커밋                                               |
| Style    | 코드 순서, css등의 포맷에 관한 커밋 (기능에 변화X)                    |
| Design   | UI 구현 (css 구체화) 커밋                                             |
| Fix      | 버그를 고친 경우                                                      |
| Refactor | 더 좋은 코드로 개선한 경우 (기능에 변화가 없는 경우) ex-코드리뷰 반영 |
| Docs     | README.md 등 문서를 작성한 경우                                       |
| Chore    | 주석 추가, 자잘한 문서 수정                                           |

<br/>

## 📁 폴더 구조

```
|-- 📁 __tests__
|-- 📁 .bundle
|-- 📁 .idea
|-- 📁 android
|-- 📁 ios
|-- 📁 node_modules
|-- 📁 src
	|-- 📁 components
		|-- 📁 common
		|-- 📁 components를 사용하는 page이름
	|-- 📁 pages
	|-- 📁 services
        |-- 📁 constants
        |-- 📁 hooks
	|-- 📁 assets
		|-- 📁 icon
		|-- 📁 image
	|-- 📁 styles
		|-- globalStyle.tsx
		|-- theme.tsx
	|-- 📁 utils
	|-- 📁 navigation
	|-- 📁 store
|-- App.tsx
|-- index.js
|-- .gitignore
|-- package.json
|-- package-lock.json
|-- README.md
```

📁 **src > components**

재사용 가능한 컴포넌트들이 위치하는 폴더입니다.

- common 폴더

⇒ 여러 페이지에서 사용할 공통 컴포넌트 (ex- Button, Header)

- 각 페이지별 폴더

⇒ 각 페이지별 폴더 생성 후, 내부에 연관 컴포넌트 파일 생성하기

📁 **src > assets**

- 파일명 : `ic_arrow.svg` _(snake case)_
- 컴포넌트명 (사용할 때) : `IcArrow.svg` _(Pascal case)_

이미지 혹은 폰트와 같은 파일들이 저장되는 폴더입니다.
이미지와 같은 파일들을 public에 직접 넣는 경우도 있는데 둘의 차이는 컴파일시에 필요한지 여부입니다.
파비콘과 같이 index.html내부에서 직접 사용하여 컴파일 단계에서 필요하지 않은 파일들은 public에
반면, 컴포넌트 내부에서 사용하는 이미지 파일인 경우 이 assets 폴더에 위치시켜야 합니다.

📁 **src > hooks**

커스텀 훅이 위치하는 폴더입니다.

📁 **src > pages**

react router등을 이용하여 라우팅을 적용할 때 페이지 컴포넌트를 이 폴더에 위치시킵니다.
페이지의 최상단 컴포넌트. 각 컴포넌트를 하나의 페이지에서 호출하는 곳

📁 **src > constants**

공통적으로 사용되는 상수들을 정의한 파일들이 위치하는 폴더입니다.

📁 **src > config**

config 파일이 많지 않은 경우 보통 최상위에 위치시켜놓지만 여러개의 config 파일이 있을 경우 폴더로 분리하기도 합니다.

📁 **src > styles**

globalStyle등의 전역 css 파일들이 포함되는 폴더입니다.

📁 **src > services(=api)**

보통 api관련 로직의 모듈 파일이 위치하며 auth와 같이 인증과 관련된 파일이 포함되기도 합니다.

📁 **src > utils**

정규표현식 패턴이나 공통함수 등 공통으로 사용하는 유틸 파일들이 위치하는 폴더입니다.

📁 **src > navigation**

네비게이션 설정 파일입니다. 페이지마다 보여지는 네비게이션을 핸들링 하도록 합니다.

📁 **src > store**

리덕스, MobX 등의 상태 관리 라이브러리와 관련된 코드를 저장하는 폴더입니다.

<hr></hr>

### :tongue: 네이밍

- 컴포넌트명 : PascalCase
- 내부함수명 : camelCase
- 변수명 : camelCase
- 상수명 : UPPER_CASE

<aside>
<b>이벤트 핸들러 이름</b>

- handle이벤트명 = () ⇒ {}
- handleClick, handleSubmit, ...
</aside>
