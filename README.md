# SnakeQuest Game

Welcome to **SnakeQuest**, a fun and challenging snake game built with Python and Flask. This game features classic snake gameplay with a modern twist. Navigate through levels, avoid obstacles, and see how far you can get!

## Game Features

- Classic Snake gameplay
- Incluedes special items so the Snake grows faster
- Includes level (Beginner, Medium, Hard)
- Has 3 Designs Modern (default), Nokia 7110, and Matrix style

## Dev Features
- Flask-based backend for dynamic game logic
- SQLAlchemy integration for storing high scores
- Interactive web-based user interface
- Responsive design for smooth play

## Requirements

To play **SnakeQuest**, you’ll need the following:

- **Python 3.7+**
- **Poetry** (optional, but recommended for managing dependencies)
- Web browser (for playing the game via a web interface)

### Installing Dependencies

You can install the required dependencies using **Poetry** (preferred) or **pip**.

#### Using Poetry:

1. **Install Poetry** (if you haven't already):

   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. **Verify the Update**:
   ```bash
   poetry --version
   ```

3. **Install the dependencies**:
   ```bash
   poetry install
   ```
optional Install dependencies with pip:
  ```bash
  pip install -r requirements.txt
```

## Running the Game
Once you've installed the dependencies, you can run the game using the following command:

```bash
python3 main.py
```

This will start a local development server, and you can open your browser to http://127.0.0.1:5000/ to play the game.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Contributing
Feel free to fork the repository, create a branch, and submit pull requests if you'd like to contribute to the development of SnakeQuest. Please make sure to follow the coding standards and include appropriate tests.

Thanks for checking out SnakeQuest! I hope you enjoy playing the game as much as I enjoyed building it.
