# Getting started

## Install and prepare

### Frontend

1. Install dependencies (in frontend directory)

```sh
npm install
```

2. copy .env.dev to .env and put in a websocket url

### backend

1. Create a virtual environment (in backend directory)

```sh
python3 -m venv venv
```

2. Activate the virtual environment

```sh
source venv/bin/activate
```

3. install requirements.txt

```sh
pip install -r requirements.txt
```

4. copy .env.dev to .env and put in your openai api key

## Running the app

- Start frontend (in frontend directory)

```sh
npm run dev
```

- Start backend (in backend directory)

```sh
python3 app.py
```

- open http://localhost:5173 in your browser
