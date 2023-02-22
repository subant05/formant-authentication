#Formant Authentication Module

## Installation
- npm i formant-authentication

## Add .env with the following variables
- FORMANT_API_URL=https://api.formant.io
- FORMANT_EMAIL= <email of service account>
- FORMANT_PASSWORD= <service account password>
- FORMANT_REFRESH_TOKEN=
- FORMANT_REFRESH_TOKEN_EXPIRATION=0

## Use: connected()
- import * as FormantAuth from "formant-authentication"
- const connected = await FormantAuth.connect()

## Use: expressModule()
- import express from "express";
- import * as FormantAuth from "formant-authentication"
- const router = express.Router();
- router.use(FormantAuth.expressModule);
