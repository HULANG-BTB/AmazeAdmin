<?php

namespace app\backend\controller;

use think\Controller;
use think\Request;
use think\Url;

class Index extends Controller
{

    public function index()
    {
        return $this->view->fetch();
    }


    public function create()
    {
        //
    }

    public function save(Request $request)
    {
        //
    }

    public function read($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function delete($id)
    {
        //
    }
}
