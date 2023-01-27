<?php

namespace App\Model;

use App\Store\StoreInterface;
use Nette;

final class EmployeeFacade
{
    use Nette\SmartObject;

    private $storeType = 'Employees';

    public function __construct(
        private StoreInterface $store,
    )
    {
    }

    public function list()
    {
        return $this->store->list($this->storeType);
    }

    public function create($employee)
    {
        return $this->store->insert($this->storeType, $employee);
    }

    public function update($id, $employee)
    {
        return $this->store->update($this->storeType, $id, $employee);
    }

    public function remove($id)
    {
        return $this->store->remove($this->storeType, $id);
    }

    public function find(string $employeeId)
    {
        try {
            return $this->store->find($this->storeType, $employeeId);
        } catch (e) {
            // ignore error and by default return null
        }
        return null;
    }
}
