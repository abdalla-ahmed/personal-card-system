<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

use Spatie\Browsershot\Browsershot;
//use Spatie\LaravelPdf\Facades\Pdf;
//use function Spatie\LaravelPdf\Support\pdf;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends ApiController
{
    public function generatePdf(Request $request)
    {
        $data = $request->all();
        if (!isset($data['html']))
            return $this->resUnexpected();;

        $html = base64_decode($data['html']);
        $pdf = Pdf::loadHTML($html)
            ->setPaper('a5')
            ->setOption('defaultFont', 'sans-serif'); // Adjust if needed

        return $this->resSuccess(base64_encode($pdf->output()));
    }

    public function generatePdf2(Request $request)
    {        return $this->resUnexpected();
        $data = $request->all();
        if (!isset($data['html']))
            return $this->resUnexpected();;

        $html = base64_decode($data['html']);

        $pdfContent = Browsershot::html($html)
            ->setNodeBinary('C:\Program Files\nodejs\node.exe') // Adjust path if needed
            ->setNpmBinary('C:\Program Files\nodejs\node_modules\npm') // Adjust path if needed
            ->setNodeModulePath('C:\xampp\htdocs\personal-card-system\api\node_modules')
            ->waitUntilNetworkIdle()
            ->format('a5')
            ->base64pdf(); // Generate PDF without saving

        return $this->resSuccess($pdfContent);
    }
}
