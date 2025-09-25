<?php 
require_once('../config/database.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? null;
$titulo = $data['titulo'] ?? null;
$artista = $data['artista'] ?? null;
$album = $data['album'] ?? null;
$caminho_arquivo = $data['caminho_arquivo'] ?? null;

if (!$id || !$titulo || !$artista) {
    http_response_code(400);
    echo json_encode(['mensagem' => 'Dados inválidos. ID, título e artista são obrigatórios.']);
    exit;
}

try {
    $sql = "UPDATE songs SET titulo = ?, artista = ?, album = ?, caminho_arquivo = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt -> execute([
        $titulo,
        $artista,
        $album,
        $caminho_arquivo,
        $id
    ]);
    
    if ($stmt->rowCount()){
        echo json_encode(['mensagem' => 'Música atualizada com sucesso!']);
    } else {
        http_response_code(404);
        echo json_encode(['mensagem' => 'Música não encontrada ou nenhum dado alterado.']);
    }
} catch (\PDOException $e){
    http_response_code(500);
    echo json_encode(['mensagem' => 'Erro ao atualizar a música:'.$e->getMessage()]);
}
?>