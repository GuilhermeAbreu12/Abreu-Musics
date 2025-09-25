<?php
require_once('../config/database.php');

header('Content-Type: application/json');

try {
    // Pega o termo de busca da URL
    $searchTerm = $_GET['search'] ?? '';
    $sortBy = $_GET['sort'] ?? 'data_adicao';

    // Garante que o parâmetro de ordenação seja seguro
    $allowedSorts = ['titulo', 'artista', 'album', 'data_adicao'];
    if (!in_array($sortBy, $allowedSorts)){
        $sortBy = 'data_adicao';
    }

    $sql = "SELECT id, titulo, artista, album, caminho_arquivo FROM songs";
    $params = [];
    // Se houver um termo de busca, adiciona a cláusula WHERE
    if ($searchTerm) {
        $sql .= " WHERE titulo LIKE ? OR artista LIKE ?";
        $params[] = "%".$searchTerm."%";
        $params[] = "%".$searchTerm."%";
    }

    $sql .= " ORDER BY ".$sortBy." ASC";

    $stmt = $pdo -> prepare($sql);
    $stmt -> execute($params);
    $songs = $stmt -> fetchAll();

    echo json_encode(['status' => 'sucesso', 'data' => $songs]);

} catch (\PDOException $e){
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao listar as músicas:'.$e -> getMessage()]);
}
?>