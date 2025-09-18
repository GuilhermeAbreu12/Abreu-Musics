<?php 
require_once('../config/database.php'); // Contecta com o banco

header('Content-Type: application/json'); // transforma em JSON

$data = json_decode(file_get_contents('php://input'), true); // Transforma a requisição Post+JSON em um array PHP chamado $data

// Se não existir algum desses campos
if (!isset($data['titulo'], $data['artista'], $data['caminho_arquivo'])){
    http_response_code(400); // Retorna um erro 400 em JSON
    echo json_encode(['mensagem' => 'Dados incompletos']);
    exit;
}

try {
    $sql = "INSERT INTO songs (titulo, artista, album, caminho_arquivo) VALUES (?, ?, ?, ?)";

    $stmt = $pdo -> prepare($sql); // Prepare evita SQL injection

    $stmt -> execute([ // Execute evita SQL injection
        $data['titulo'],
        $data['artista'],
        $data['album'] ?? null, // Se não tiver album, coloca null
        $data['caminho_arquivo']
    ]);

    echo json_encode(['mensagem' => 'Música adicionada com sucesso!', 'id' => $pdo -> lastInsertId()]);
} catch (\PDOException $e) { // Se der erro no Banco, retorna mensagem de erro código 500
    http_response_code(500);
    echo json_encode(['mensagem' => 'Erro ao adicionar a música:'.$e->getMessage()]);
}
?>