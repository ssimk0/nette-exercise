<?php
namespace App\Presenters;
use App\Model\EmployeeFacade;
use Nette\Http\Request;
use Nette\Http\Response;
use Nette;
use Vite;

abstract class BasePresenter extends Nette\Application\UI\Presenter
{
    public function __construct(
            private Vite $vite,
            protected EmployeeFacade $employeFacade,
            protected Request $request,
            protected Response $response,
    ) {
    }

    public function beforeRender(): void
    {
        $this->template->vite = $this->vite;
    }
}
