<?php
// tasks.php
header('Access-Control-Allow-Origin:  http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'todo_db');

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM tasks ORDER BY id DESC";
        $result = $conn->query($sql);
        $tasks = [];
        
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        
        echo json_encode($tasks);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $title = $conn->real_escape_string($data['title']);
        
        $sql = "INSERT INTO tasks (title) VALUES ('$title')";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Task created successfully']);
        } else {
            echo json_encode(['error' => $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $conn->real_escape_string($data['id']);
        $title = $conn->real_escape_string($data['title']);
        
        $sql = "UPDATE tasks SET title='$title' WHERE id=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Task updated successfully']);
        } else {
            echo json_encode(['error' => $conn->error]);
        }
        break;

    case 'DELETE':
        $id = $conn->real_escape_string($_GET['id']);
        
        $sql = "DELETE FROM tasks WHERE id=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Task deleted successfully']);
        } else {
            echo json_encode(['error' => $conn->error]);
        }
        break;
}

$conn->close();
?>