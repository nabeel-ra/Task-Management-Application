from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=1)  # 1: Low, 2: Medium, 3: High

@app.route('/')
def index():
    tasks = Task.query.order_by(Task.priority.desc(), Task.created_at.desc()).all()
    return render_template('index.html', tasks=tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    title = request.form['title']
    description = request.form['description']
    priority = int(request.form['priority'])
    new_task = Task(title=title, description=description, priority=priority)
    db.session.add(new_task)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/update_task/<int:task_id>', methods=['POST'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.title = request.form['title']
    task.description = request.form['description']
    task.priority = int(request.form['priority'])
    db.session.commit()
    return jsonify({'success': True})

@app.route('/complete_task/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.completed = not task.completed  # Toggle completion status
    db.session.commit()
    return jsonify({'success': True})

@app.route('/delete_task/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'success': True})

def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized.")

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
