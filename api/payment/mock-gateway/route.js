"use strict";(()=>{var e={};e.id=796,e.ids=[796],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},1056:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>g,originalPathname:()=>x,patchFetch:()=>v,requestAsyncStorage:()=>u,routeModule:()=>m,serverHooks:()=>h,staticGenerationAsyncStorage:()=>l,staticGenerationBailout:()=>y});var o={};a.r(o),a.d(o,{GET:()=>c});var r=a(2390),n=a(1498),s=a(9308),i=a(7024),p=a(6113),d=a.n(p);async function c(e){let t=new URL(e.url),a=t.searchParams.get("sessionId")||"",o=t.searchParams.get("tx")||"",r=t.searchParams.get("provider")||"bkash",n=t.searchParams.get("amount")||"0",s=t.searchParams.get("sig")||"",p=process.env.PAYMENT_SECRET||"dev-secret",c=`${a}|${o}|${r}|${n}`;if(s!==d().createHmac("sha256",p).update(c).digest("hex"))return i.Z.json({error:"Invalid signature"},{status:400});let m=`${process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"}/add-money/confirm?sessionId=${encodeURIComponent(a)}&tx=${encodeURIComponent(o)}&provider=${encodeURIComponent(r)}&amount=${encodeURIComponent(n)}&sig=${encodeURIComponent(s)}`,u=`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mock Gateway - ${r}</title>
        <style>body{font-family:system-ui,Segoe UI,Roboto,Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0} .card{padding:24px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.08);max-width:420px}</style>
      </head>
      <body>
        <div class="card">
          <h2>Mock ${r} Payment</h2>
          <p>Transaction: <strong>${o}</strong></p>
          <p>Amount: <strong>${n} BDT</strong></p>
          <p>This is a simulated payment page. Click confirm to return to the app.</p>
          <div style="display:flex;gap:8px;margin-top:16px">
            <form method="GET" action="${m}">
              <button type="submit" style="padding:8px 12px;border-radius:8px;border:none;background:#2563eb;color:white">Confirm Payment</button>
            </form>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"}/add-money" style="padding:8px 12px;border-radius:8px;border:1px solid #ddd">Cancel</a>
          </div>
        </div>
      </body>
    </html>
  `;return new Response(u,{headers:{"Content-Type":"text/html"}})}let m=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/payment/mock-gateway/route",pathname:"/api/payment/mock-gateway",filename:"route",bundlePath:"app/api/payment/mock-gateway/route"},resolvedPagePath:"/Users/meheduzzaman/Desktop/Probaho/apps/web/src/app/api/payment/mock-gateway/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:u,staticGenerationAsyncStorage:l,serverHooks:h,headerHooks:g,staticGenerationBailout:y}=m,x="/api/payment/mock-gateway/route";function v(){return(0,s.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:l})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),o=t.X(0,[369,587],()=>a(1056));module.exports=o})();