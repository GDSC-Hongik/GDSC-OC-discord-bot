# GDSC 홍익 오픈 커뮤니티 디스코드 봇

## 세팅

1. [도커](/docs/contribution-guides/developers/docker) 와
   [Node.JS](https://nodejs.org)를 설치하세요

2. [디스코드 봇을 만드세요](https://discordjs.guide/preparations/setting-up-a-bot-application.html).
   모든 `Privileged Gateway Intents`또한 활성화시켜주세요.

   ![예시](.github/privileged-gateway-intents.png)

3. `.env`파일을 만들어주세요

   ```dosini
   DISCORD_BOT_TOKEN=<디스코드 봇 토큰>
   DISCORD_BOT_ID=<디스코드 봇 ID>
   ```

4. 종속 항목 설치

   ```
   npm install
   ```

5. 봇 실행

   ```
   docker compose up --build
   ```

## 학습 자료

- [디스코드 개발자 문서](https://discord.com/developers/docs)
- [Discord.js 가이드](https://discordjs.guide)
- [TypeScript 강좌](https://www.typescripttutorial.net)
