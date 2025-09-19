<?php 
require_once('../config/database.php');

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;
$data = json_decode(file_get_contents('php://input'), true);

if (!id || !isset($data['titulo'], $data['artista'])) {
    http_response_code(400);
    echo json_encode(['mensagem' => 'Dados inválidos. ID, título e artista são obrigatórios.']);
    exit;
}

try {
    $sql = "UPDATE songs SET titulo = ?, artista = ?, album = ?, caminho_arquivo = ? WHERE id = ?";
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute([
        $data['titulo'],
        $data['artista'],
        $data['album'] ?? null,
        $data['caminho_arquivo'] ?? null,
        $id
    ]);
    
    if ($stmt -> rowCount()){
        echo json_encode(['mensagem' => 'Música atualizada com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao atualizar a música:'.$e->getMessage()]);
    }
}

?>