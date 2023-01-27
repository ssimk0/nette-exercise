<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette\Application\UI\Form;
use Nette;
use Vite;

final class EmployeePresenter extends BasePresenter
{

    protected function createComponentEmployeeForm(): Form
    {
        $form = new Form; // means Nette\Application\UI\Form

        $form->addText('name', 'Meno:')
            ->setRequired();

        $form->addEmail('email', 'E-mail:');

        $form->addInteger('age', 'Vek:')
            ->addRule($form::RANGE, 'Vek musí byt od 18 do 120', [18, 120]);


        $form->addSelect('sex', 'Pohlavie:', [
            'zena' => 'zena',
            'muz' => 'muz'
        ]);

        $employeeId = $this->getParameter('employeeId');
        $form->addSubmit('send', $employeeId ? 'Upravit zamestnanca' : 'Pridat zamesnanca');

        $form->onSuccess[] = [$this, 'employeeFormSucceeded'];
        return $form;
    }

    public function employeeFormSucceeded(\stdClass $data): void
    {
        $employeeId = $this->getParameter('employeeId');
        if ($employeeId) {
            $this->employeFacade->update($employeeId, [
                'name' => $data->name,
                'email' => $data->email,
                'age' => $data->age,
                'sex' => $data->sex,
            ]);
        } else {
            $this->employeFacade->create([
                'name' => $data->name,
                'email' => $data->email,
                'age' => $data->age,
                'sex' => $data->sex,
            ]);
        }

        $this->flashMessage('Uspesne pridane', 'success');
        $this->redirect('list');
    }

    public function renderEdit(string $employeeId): void
    {
        $headers = $this->request->getHeaders();
        $employee = $this->employeFacade->find($employeeId);
        if (!$employee) {
            $this->error('Employee not found');
        }

        $this->getComponent('employeeForm')->setDefaults($employee);
        if (array_key_exists('accept', $headers) && $headers['accept'] == "application/json") {
            $this->sendJson($employee);
        }
    }


    function renderList()
    {
        $headers = $this->request->getHeaders();
        $this->template->columns = [
            [
                'name' => '#',
                'value' => function ($row) {
                    return array_key_exists('id', $row) ? $row['id'] : '';
                }
            ],
            [
                'name' => 'Meno',
                'value' => function ($row) {
                    return array_key_exists('name', $row) ? $row['name'] : '';
                }
            ],
            [
                'name' => 'Email',
                'value' => function ($row) {
                    return array_key_exists('email', $row) ? $row['email'] : '';
                }
            ],
            [
                'name' => 'Vek',
                'value' => function ($row) {
                    return array_key_exists('age', $row) ? $row['age'] : '';
                }
            ],
            [
                'name' => 'Pohlavie',
                'value' => function ($row) {
                    return array_key_exists('sex', $row) ? $row['sex'] : '';
                }
            ]
        ];
        $list = $this->employeFacade->list();
        $this->template->employees = $list;

        if (array_key_exists('accept', $headers) && $headers['accept'] == "application/json") {
            $this->sendJson($list);
        }
    }

    function renderRemove(string $employeeId)
    {
        $this->employeFacade->remove($employeeId);
        $this->redirect('Employee:list');
    }
}
