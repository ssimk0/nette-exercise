<?php

namespace App\Store;

use SimpleXMLElement;

class XmlStore implements StoreInterface
{
    private $data = [];
    private $filePath;

    public function __construct(
        string $filePath,
    )
    {
        $this->filePath = $filePath;
        $this->load();
    }

    public function insert(string $storeType, array $value): void
    {
        $this->validateStoreType($storeType);
        $value['id'] = uniqid();
        array_push($this->data[$storeType], $value);
        $this->save();
    }

    public function list(string $storeType): array
    {
        $this->validateStoreType($storeType);

        return $this->data[$storeType];
    }

    public function find(string $storeType, string $id): array|null
    {
        $this->validateStoreType($storeType);
        $key = array_search($id, array_column($this->data[$storeType], 'id'));

        return $this->data[$storeType][$key] ?? null;
    }

    public function update(string $storeType, string $id, array $data): void
    {
        $this->validateStoreType($storeType);
        $key = array_search($id, array_column($this->data[$storeType], 'id'));

        if (array_key_exists($key, $this->data[$storeType])) $this->data[$storeType][$key] = [...$data, 'id' => $id];
        $this->save();
    }

    public function remove(string $storeType, string $id): void
    {
        $this->validateStoreType($storeType);
        $key = array_search($id, array_column($this->data[$storeType], 'id'));
        array_splice($this->data[$storeType], $key, 1);
        $this->save();
    }

    private function validateStoreType(string $storeType)
    {
        if (!array_key_exists($storeType, $this->data)) $this->data[$storeType] = [];
    }

    private function save()
    {
        function array_to_xml($data, &$xml_data, $parentKey = null)
        {
            $i = 0;
            foreach ($data as $key => $value) {
                $i++;
                if (is_array($value)) {
                    if (array_key_exists('@attributes', $value)) unset($value['@attributes']);

                    if (is_numeric($key) && $parentKey) {
                        $key = $parentKey;
                    } else if (is_numeric($key)) {
                        $key = 'item' . $i;
                    }

                    $subnode = $xml_data->addChild($key);
                    if (array_key_exists('id', $value)) {
                        $subnode->addAttribute('id', $value['id']);
                    }
                    array_to_xml($value, $subnode, $key);
                } else {
                    $xml_data->addChild("$key", htmlspecialchars("$value"));
                }
            }
        }

        $xml_data = new SimpleXMLElement('<?xml version="1.0"?><data></data>');

        array_to_xml($this->data, $xml_data);
        $result = $xml_data->asXML(__DIR__ . "../../../" . $this->filePath);
    }

    private function isAssoc(array $arr)
    {
        if (array() === $arr) return false;
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    public function load()
    {
        $xmlfile = file_get_contents(__DIR__ . "../../../" . $this->filePath);

        $new = simplexml_load_string($xmlfile);
        $con = json_encode($new);

        $data = json_decode($con, TRUE);
        // remove duplicated structure like { employees: { employees: [] } } to make only { employees: [] }
        foreach ($data as $key => $value) {
            if (array_key_exists($key, $value)) {
                $data[$key] = $value[$key];
                if ($this->isAssoc($data[$key])) {
                    $data[$key] = [$value[$key]];
                }
            }
        }
        $this->data = $data;

        if (!is_array($this->data)) $this->data = [];
    }
}
