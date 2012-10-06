<?php
include __DIR__ . "/../vendor/autoload.php";

use Symfony\Component\Process\Process;

function runProcess($command)
{
    $address = 'localhost';
    $port = 5600;
    $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    socket_connect($socket, $address, $port);

    $process = new Process($command);
    $process->setTimeout(3600);
    $process->run(
        function ($type, $buffer) use ($socket) {
            if ('err' === $type) {
                socket_write($socket, "ERROR\n", strlen("ERROR\n"));
                socket_write($socket, $buffer, strlen($buffer));
            } else {

                socket_write($socket, $buffer, strlen($buffer));
            }
        }
    );
    if (!$process->isSuccessful()) {
        throw new \RuntimeException($process->getErrorOutput());
    }
    socket_close($socket);
}

runProcess('ls -latr /');
runProcess('ls -latr /home/gonzalo');

