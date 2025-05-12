<?php

namespace App\Http\Controllers;

use App\Models\OrganizationUser;
use App\Models\OrganizationVendor;
use App\Models\VendorUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Inertia\ResponseFactory;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $user_id = Auth::id();
        $user_organization_exists = OrganizationUser::where('user_id', $user_id)->exists();

        if ($user_organization_exists) {
            $organization = OrganizationUser::where('user_id', $user_id)->first();
            $vendor = OrganizationVendor::with(['vendor'])->where('organization_id', $organization->organization_id)->first();
            dd($vendor);
        } else {
            $user_vendor_exists = VendorUser::where('user_id', $user_id)->exists();

            if ($user_vendor_exists) {
                $vendor = VendorUser::where('user_id', $user_id)->first();
            } else {
                return redirect('/');
            }
        }

        //return inertia("Customer/Dashboard/Index", []);
    }
}
