# GDSC Open Community 디스코드 봇

## 개발 세팅

개발 환경 세팅을 위한 설명입니다. production 환경 세팅은
[GDSC-OC/deploy](https://github.com/GDSC-OC/deploy)를 참고하세요.

1. [Node.JS](https://nodejs.org) (v16.6.0+) 를 설치하세요.

2. 디스코드 봇을 만드세요
   ([설명](https://discordjs.guide/preparations/setting-up-a-bot-application.html)).

   - 모든 `Privileged Gateway Intents`또한 활성화시켜주세요.

   ![gateway intents](.github/privileged-gateway-intents.png)

   - `public bot` 기능을 **비**활성화시켜주세요.

   ![gateway intents](.github/public-bot.png)

3. `.env`파일을 만들어주세요

   ```dosini
   DISCORD_BOT_TOKEN=<디스코드 봇 토큰>
   SIGN_UP_URL=<회원가입 URL>
   ```

4. 종속 항목 설치

   ```
   npm install
   ```

5. [API 서버](https://github.com/GDSC-OC/rating) 실행

6. 웹사이트 실행 (회원가입이 필요하다면)

   - https://github.com/GDSC-OC/website

7. [여기](https://console.firebase.google.com/u/0/project/gdsc-oc-beta/settings/serviceaccounts/adminsdk)에서 service account key 샐성 후 `src/lib/serviceAccountKey.json`에 저장

8. 봇 실행

   ```
   npm run dev
   ```

## 학습 자료

- [디스코드 개발자 문서](https://discord.com/developers/docs)
- [Discord.js 가이드](https://discordjs.guide)
- [Sapphire framework 문서](https://sapphirejs.dev/docs/General/Welcome)
- [TypeScript 강좌](https://www.typescripttutorial.net)
