<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>モアイ倒し戦争GAME</title>
    <link rel="stylesheet" type="text/css" href="main.css">
    <link rel="shortcut icon" href="favicon.ico">
</head>

<body>
    <div id="header">
        <h1>モアイ倒し戦争GAME</h1>
        <ul class="menu">
            <li><a href="./final.html">ホーム</a></li>
            <li><a href="./aboutMoaiWar.html">モアイ倒し戦争とは</a></li>
            <li><a href="./wayToPlay.html">遊び方</a></li>
            <li><a href="./ranking.php">ランキング</a></li>
        </ul>
    </div>
    <div id="main">
        <h2>ランキング</h2>
        <?php
        $file='board.txt';
        if (file_exists($file)) {
            $board=json_decode(file_get_contents($file));
        }
        //降順にソート
        rsort($board);

        $i = 1;
        foreach ($board as $score) {
            echo '<p>', $i, '位 - ', $score, '</p><hr>';
            $i ++;
        }
        ?>
        <div id="footer">
        </div>
</body>

</html>