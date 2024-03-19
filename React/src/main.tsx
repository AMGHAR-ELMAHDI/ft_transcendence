import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


// export default function RootLayout({
//   children,
// }){
//   return (
//     <html lang="en">
//       <body className={cn(`bg-background text-foreground text-sm flex`, inter.className)} >
// 		<NavBar />
// 		<div className="flex flex-col [&>*]:h-full  max-w-[2560px] mx-auto max-h-[120rem] flex-1 ">
// 			{children}
// 		</div>
// 		<SideBar/>
//       </body>
//     </html>
//   );
// }