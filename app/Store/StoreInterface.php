<?php

namespace App\Store;

interface StoreInterface
{
    public function insert(string $storeType, array $value): void;

    public function remove(string $storeType, string $id): void;

    public function list(string $storeType): array;

    public function find(string $storeType, string $id): array|null;

    public function update(string $storeType, string $id, array $data): void;
}